<?php

/**
 * @file
 * This file contains the api functions which developers can use to
 * influence the interaction results.
 */

/**
 * Get an overview of the current registered interaction functions and keys.
 */
function ding_interaction_admin_overview($form, &$form_state) {
  $form['ding_interaction_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Ding interaction settings'),
    '#weight' => 5,
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $form['ding_interaction_settings']['ding_interaction_page_count'] = array(
    '#type' => 'select',
    '#title' => t('Page count'),
    '#description' => t('Set the amount of page views between ding interaction displays'),
    '#options' => array(
      1 => '1',
      2 => '2',
      3 => '3',
      4 => '4',
      5 => '5',
      6 => '6',
      7 => '7',
      8 => '8',
      9 => '9',
      10 => '10',
      11 => '11',
      12 => '12',
      13 => '13',
      14 => '14',
      15 => '15',
      16 => '16',
      17 => '17',
      18 => '18',
      19 => '19',
      20 => '20',
    ),
    '#default_value' => variable_get('ding_interaction_page_count', 5),
    '#required' => TRUE,
  );

  $form['ding_interaction_callbacks'] = array(
    '#type' => 'tableselect',
    '#header' => array(
      'title' => t('Title'),
      'weight' => t('Weight'),
      'settings' => t('Settings'),
    ),
    '#options' => array(),
    '#default_value' => variable_get('ding_interaction_callbacks', array()),
  );

  $weights = variable_get('ding_interaction_weights', array());
  $form['ding_interaction_callbacks']['#process'][] = 'ding_interaction_process_options';
  $info = ding_interaction_available_content(TRUE);
  foreach ($info as $key => $value) {
    $weight = isset($value['weight']) ? $value['weight'] : 1;
    $form['ding_interaction_callbacks']['#options'][$key] = array(
      'title' => $value['title'],
      'weight' => array(
        'data' => array(
          '#type' => 'select',
          '#title' => '',
          '#options' => drupal_map_assoc(ding_interaction_weight_options()),
          '#value' => (isset($weights[$key])) ? array($weights[$key]) : array($weight),
          '#description' => t('Choose a weight for this interaction function.'),
          '#name' => 'ding_interaction_weights[' . $key . ']',
        ),
      ),
      'settings' => '',
    );
    if (isset($value['settings']) && $value['settings']) {
      $settings = $value['settings'];
      $form['ding_interaction_callbacks']['#options'][$key]['settings'] = array(
        'data' => l(
          t('Settings'),
          'admin/config/ding/interaction/key_overview/' . $settings,
          array('query' => array('destination' => 'admin/config/ding/interaction/key_overview'))
        ),
      );
    }
  }
  $form['ding_interaction_weights'] = array(
    '#type' => 'value',
  );
  $form['ding_interaction_help'] = array(
    '#type' => 'fieldset',
    '#title' => t('Ding interaction help'),
    '#weight' => 6,
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $form['ding_interaction_help']['markup'] = array(
    '#type' => 'markup',
    '#markup' => t('Ding Interactions are all sorts of information and interaction with the user which we want to present in rotation. In order not to overload the user with information, just one Ding Interaction is shown per page view. This way the user can casually be informed with deeper features of the website, occasionally be asked to interact (Like when asking the user to rate previous loans) and have an area which changes relevant content with no need for manual editing or administration.<br /><br />
Insert a "Ding interaction pane" on any page to display the Ding Interactions in rotation.') . '<br /><br />' .
    l(t('> Overview of all manual Ding Interactions'), 'admin/structure/entity-type/ding_type/ding_interaction') .
    '<br />' .
    l(t('> Create new manual Ding Interaction'), 'admin/structure/entity-type/ding_type/ding_interaction/add') .
    '<br /><br />' . 'Developers can use the API hooks to create new Ding Interactions.',
  );

  return system_settings_form($form);
}

/**
 * Process admin form options.
 */
function ding_interaction_process_options($element) {
  if ($element['#multiple']) {
    $value = is_array($element['#value']) ? $element['#value'] : array();
  }
  else {
    // Advanced selection behavior makes no sense for radios.
    $element['#js_select'] = FALSE;
  }

  $element['#tree'] = TRUE;

  if (count($element['#options']) > 0) {
    if (!isset($element['#default_value']) || $element['#default_value'] === 0) {
      $element['#default_value'] = array();
    }

    // Create a checkbox or radio for each item in #options in such a way that
    // the value of the tableselect element behaves as if it had been of type
    // checkboxes or radios.
    foreach ($element['#options'] as $key => $choice) {
      // Do not overwrite manually created children.
      if (!isset($element[$key])) {
        if ($element['#multiple']) {
          $title = '';
          if (!empty($element['#options'][$key]['title']['data']['#title'])) {
            $title = t('Update @title', array(
                '@title' => $element['#options'][$key]['title']['data']['#title'],
              ));
          }
          $element[$key] = array(
            '#type' => 'checkbox',
            '#title' => $title,
            '#title_display' => 'invisible',
            '#return_value' => $key,
            '#default_value' => isset($value[$key]) ? $key : NULL,
            '#attributes' => $element['#attributes'],
          );
        }
        else {
          // Generate the parents as the autogenerator does, so we will have a
          // unique id for each radio button.
          $parents_for_id = array_merge($element['#parents'], array($key));
          $element[$key] = array(
            '#type' => 'radio',
            '#title' => '',
            '#return_value' => $key,
            '#default_value' => ($element['#default_value'] == $key) ? $key : NULL,
            '#attributes' => $element['#attributes'],
            '#parents' => $element['#parents'],
            '#id' => drupal_html_id('edit-' . implode('-', $parents_for_id)),
            '#ajax' => isset($element['#ajax']) ? $element['#ajax'] : NULL,
          );
        }
        if (isset($element['#options'][$key]['#weight'])) {
          $element[$key]['#weight'] = $element['#options'][$key]['#weight'];
        }
      }
    }
  }
  else {
    $element['#value'] = array();
  }
  return $element;
}

/**
 * Default options for weight.
 *
 * @return array
 *   Array of default options (0 through 5)
 */
function ding_interaction_weight_options() {
  return array(0, 1, 2, 3, 4, 5);
}
